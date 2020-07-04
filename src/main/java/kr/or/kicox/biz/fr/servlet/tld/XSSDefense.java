package kr.or.kicox.biz.fr.servlet.tld;

import kr.or.kicox.biz.fr.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

public class XSSDefense {

    private static String contextPath = null;

    private XSSDefense() {
    }

    public static String filter(final String text) {
        return StringUtils.xss(text);
    }

    public static String avoid(final String html) {
        return html
                .replaceAll("(?i)<(script|meta|iframe|object|embed)", "&lt;$1");
    }

    public static String path(final String path) {
        return StringUtils.path(path);
    }

    public static String filteredPath(final String path) {
        return path(filter(path));
    }

    public static String contextPath() {
        if (contextPath == null) {
            contextPath = filteredPath(
                    ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes())
                            .getRequest()
                            .getContextPath()
            );
        }

        return contextPath;
    }
}
