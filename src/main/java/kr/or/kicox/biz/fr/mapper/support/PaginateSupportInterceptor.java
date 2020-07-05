package kr.or.kicox.biz.fr.mapper.support;

import org.apache.ibatis.binding.MapperMethod.ParamMap;
import org.apache.ibatis.cache.CacheKey;
import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.BoundSql;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.mapping.MappedStatement.Builder;
import org.apache.ibatis.mapping.ResultMap;
import org.apache.ibatis.plugin.Interceptor;
import org.apache.ibatis.plugin.Intercepts;
import org.apache.ibatis.plugin.Invocation;
import org.apache.ibatis.plugin.Plugin;
import org.apache.ibatis.plugin.Signature;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort.Order;
import org.springframework.util.ObjectUtils;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

@Intercepts({
    @Signature(type = Executor.class, method = "query", args = {MappedStatement.class,
        Object.class, RowBounds.class, ResultHandler.class}),
    @Signature(type = Executor.class, method = "query", args = {MappedStatement.class,
        Object.class, RowBounds.class, ResultHandler.class, CacheKey.class, BoundSql.class})
})
public class PaginateSupportInterceptor implements Interceptor {
    private static final Logger logger = LoggerFactory.getLogger(PaginateSupportInterceptor.class);
    
    public static final ThreadLocal<CountedPageable> pageableRequest = new ThreadLocal<>();
    
    public Object intercept(Invocation invocation) throws Throwable {
        Object parameter = invocation.getArgs()[1];
        final Pageable pageable = getPageableObject(parameter);
        
        if (pageable == null) {
            return invocation.proceed();
        }
        
        Executor executor = (Executor) invocation.getTarget();
        ResultHandler<?> resultHandler = (ResultHandler<?>) invocation.getArgs()[3];
        
        parameter = getParameterWithoutPageable(parameter);
        
        MappedStatement ms = (MappedStatement) invocation.getArgs()[0];
        List<Object> counting = executor.query(
            createCountingMappedStatement(ms, parameter),
            parameter,
            RowBounds.DEFAULT,
            resultHandler
        );
        
        long total = 0;
        if (!ObjectUtils.isEmpty(counting)) {
            final Long firstItem = (Long) counting.get(0);
            if (firstItem != null) {
                total = firstItem;
            }
        }
        
        final List<Object> list = executor.query(
            createPaginateMappedStatement(
                ms,
                ms.getBoundSql(parameter),
                ms.getResultMaps(),
                pageable
            ),
            parameter,
            RowBounds.DEFAULT,
            resultHandler);
        
        
        pageableRequest.set(new CountedPageable(pageable, total));
        return list;
    }
    
    private Object getParameterWithoutPageable(Object parameter) {
        if (parameter instanceof ParamMap) {
            final ParamMap<?> parameterMap = (ParamMap<?>) parameter;
            final ParamMap<Object> filteredParameterMap = new ParamMap<>();
            final List<String> filteredParameterKeys = new ArrayList<>();
            
            for (String key : parameterMap.keySet()) {
                Object param = parameterMap.get(key);
                if (!isPageable(param)) {
                    if (!filteredParameterMap.containsValue(param)) {
                        filteredParameterKeys.add(key);
                    }
                    
                    filteredParameterMap.put(key, param);
                }
            }
            
            if (filteredParameterKeys.size() == 1) {
                return filteredParameterMap.get(filteredParameterKeys.get(0));
            }
            else {
                return filteredParameterMap;
            }
        }
        
        return parameter;
    }
    
    private Pageable getPageableObject(Object params) {
        if (params instanceof ParamMap) {
            final ParamMap<?> parameterMap = (ParamMap<?>) params;
            
            for (String key : parameterMap.keySet()) {
                Object param = parameterMap.get(key);
                if (isPageable(param)) {
                    return (Pageable) param;
                }
            }
        }
        
        return null;
    }
    
    private boolean isPageable(Object obj) {
        return obj instanceof Pageable;
    }
    
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }
    
    public void setProperties(Properties properties) {
    }
    
    private MappedStatement createCountingMappedStatement(final MappedStatement ms, Object param) {
        final BoundSql boundSql = ms.getBoundSql(param);
        
        final String sql = "SELECT COUNT(*) FROM (/** adapted by pagination **/" +
            boundSql.getSql() +
            "/** adapted by pagination **/)";
        
        Builder builder = new Builder(
            ms.getConfiguration(),
            ms.getId() + "_ForCount",
            parameterObject -> new BoundSql(
                ms.getConfiguration(),
                sql,
                boundSql.getParameterMappings(),
                boundSql.getParameterObject()
            ),
            ms.getSqlCommandType()
        );
        
        List<ResultMap> resultMaps = new ArrayList<>(1);
        resultMaps.add(
            new ResultMap.Builder(
                ms.getConfiguration(),
                ms.getId() + "_ForCount",
                Long.class,
                ms.getResultMaps().get(0).getResultMappings()
            ).build()
        );
        
        builder
            .resource(ms.getResource())
            .fetchSize(1)
            .statementType(ms.getStatementType())
            .timeout(ms.getTimeout())
            .parameterMap(ms.getParameterMap())
            .resultMaps(resultMaps)
            .flushCacheRequired(ms.isFlushCacheRequired())
            .useCache(ms.isUseCache())
            .cache(ms.getCache());
        
        return builder.build();
    }
    
    private MappedStatement createPaginateMappedStatement(final MappedStatement ms,
                                                          final BoundSql boundSql,
                                                          final List<ResultMap> resultMap,
                                                          final Pageable pageable) {
        
        final StringBuilder sql = new StringBuilder(boundSql.getSql());
        if (pageable.getSort() != null) {
            sql
                .append("SELECT * FROM (/** adapted by pagination **/")
                .append(boundSql.getSql())
                .append("/** adapted by pagination **/) ORDER BY ");
            
            boolean first = true;
            for (Order order : pageable.getSort()) {
                sql
                    .append(first ? "" : ", ")
                    .append(order.getProperty()).append(" ")
                    .append(order.getDirection());
                
                first = false;
            }
        }
        
        final int page = pageable.getPageNumber();
        final int size = pageable.getPageSize();
        sql.append(" OFFSET ").append(page * size)
            .append(" LIMIT ").append(size);
        
        try {
            Field field = BoundSql.class.getDeclaredField("sql");
            field.setAccessible(true);
            field.set(boundSql, sql.toString());
        }
        catch (NoSuchFieldException | SecurityException | IllegalArgumentException | IllegalAccessException e) {
            logger.error(e.getMessage());
        }
        
        return new Builder(
            ms.getConfiguration(),
            ms.getId(),
            parameterObject -> boundSql,
            ms.getSqlCommandType()
        )
            .resource(ms.getResource()).fetchSize(ms.getFetchSize())
            .statementType(ms.getStatementType()).keyGenerator(ms.getKeyGenerator())
            .timeout(ms.getTimeout()).parameterMap(ms.getParameterMap()).resultMaps(resultMap)
            .resultSetType(ms.getResultSetType()).cache(ms.getCache())
            .flushCacheRequired(ms.isFlushCacheRequired()).useCache(ms.isUseCache())
            .build();
    }
    
    public static final class CountedPageable extends PageRequest {
        private final long total;
        
        public CountedPageable(Pageable pageable, long total) {
            super(pageable.getPageNumber(), pageable.getPageSize());
            this.total = total;
        }
        
        public long getTotal() {
            return total;
        }
    }
}
