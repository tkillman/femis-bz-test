package kr.or.kicox.biz.fr.model;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;

import kr.or.kicox.biz.fr.exception.RequestFormatException;
import kr.or.kicox.biz.fr.util.IpUtils;
import kr.or.kicox.biz.fr.util.SessionUtils;

public class In {

	private static final Logger LOGGER = LoggerFactory.getLogger(In.class);

	private HttpServletRequest request ;
	private JsonElement element;
	private Gson gson;
	private String sessionUserId ;


	private Map<String,Object> datas    = new HashMap<String,Object>();
	private Map<String,Object> datasets = new HashMap<String,Object>();

	private JsonElement jsondatas ;
	private JsonElement jsondatasets;
	private List<MultipartFile> files;
	In(HttpServletRequest request) {
		this.request = request;
		this.gson = new GsonBuilder()
				.registerTypeAdapter(int.class, new EmptyStringToNumberTypeAdapter())
				.registerTypeAdapter(Integer.class, new EmptyStringToNumberTypeAdapter())
				.registerTypeAdapter(double.class, new EmptyStringToNumberTypeAdapter())
		        .registerTypeAdapter(Double.class, new EmptyStringToNumberTypeAdapter())
		        .registerTypeAdapter(BigDecimal.class, new EmptyStringToNumberTypeAdapter())
		        .registerTypeAdapter(Float.class, new EmptyStringToNumberTypeAdapter())
		        .registerTypeAdapter(float.class, new EmptyStringToNumberTypeAdapter())
		        .create();

		this.sessionUserId  = SessionUtils.getSessionUserId(); //로그인되었다면 session id.
		this.parse();
	}

	/**
	 * 파싱한다.
	 */
	private void parse() {

		JsonParser parser = new JsonParser();

		try {

			String contentType = this.request.getHeader("Content-Type");
			if(contentType.indexOf("multipart/form-data;")==0 ) { //파일 타입 때문에 기능을 추가했다. 2019-12-06
				this.files = new ArrayList<MultipartFile>();
				String jsonData = this.request.getParameter("jsonData");
				//System.out.println("jsonData:"+jsonData);
				this.element = parser.parse(jsonData);
			}else {
				this.element = parser.parse(this.request.getReader());
			}

			JsonObject root = this.element.getAsJsonObject();
			this.jsondatas =  root.get( "datas" );
			this.jsondatasets =  root.get( "datasets" );

		} catch (IOException e) {
			throw new RequestFormatException("request의 형식이 올바르지 않습니다.",e);
		}

	}

	/**
	 * 해당 request가 multipart/form-data 일 경우 true 를 리턴한다.
	 * 다른 타입일 경우 false를 리턴한다.
	 * @return
	 */
	public boolean isMultiPartType() {
		if(this.files == null)
			return false;
		return true;
	}

	/**
	 * data를 classType으로 리턴받는다.
	 * @param name
	 * @param classOfT
	 * @return
	 */
	public <T> T data(String name,Class<T> classOfT) {

		if(this.datas.containsKey(name)) {
			return (T)this.datas.get(name);
		}
		this.extractData( name, classOfT);
		return (T)this.datas.get(name);
	}

	public <T> List<T> dataset(String name,Class<T> classOfT) {

		if(this.datasets.containsKey(name)) {
			return (List<T>)this.datasets.get(name);
		}

		this.extractDataset( name, classOfT);
		return (List<T>)this.datasets.get(name);
	}



	/**
	 * request json 에서 data를 추출하여 저장한다.
	 * @param name
	 */
	private <T> void extractData(String name,Class<T> classOfT) {

		JsonElement je =  this.jsondatas.getAsJsonObject().get(name);
		this.datas.put(name, this.extractData(je,classOfT));

	}


	private <T> void extractDataset(String name, Class<T> classOfT) {

		JsonElement je =  this.jsondatasets.getAsJsonObject().get(name);
		JsonArray ja =  je.getAsJsonArray();
		List<T> list = new ArrayList<T>();

		JsonElement t ;
		for(int i=0 ; i<ja.size() ;i++) {
			list.add(this.extractData(ja.get(i), classOfT));
		}

		this.datasets.put(name, list);
	}



	/**
	 * jsonElement를 클래스로 리턴한다.
	 * @param je
	 * @param classOfT
	 * @return
	 */
	private <T> T extractData(JsonElement je,Class<T> classOfT) {
		//LOGGER.debug("je");
		//LOGGER.debug(je.toString());

		T t= (T)gson.fromJson(je, classOfT);
		if (t instanceof CommonVo ) {
			((CommonVo) t).sessionUserId = this.sessionUserId;
		}

		return t;

	}


	public static class EmptyStringToNumberTypeAdapter extends TypeAdapter<Number> {

		@Override
        public void write(JsonWriter jsonWriter, Number number) throws IOException {
            if (number == null) {
                jsonWriter.nullValue();
                return;
            }
            jsonWriter.value(number);
        }

        @Override
        public Number read(JsonReader jsonReader) throws IOException {
            if (jsonReader.peek() == JsonToken.NULL) {
                jsonReader.nextNull();
                return null;
            }

            try {
                String value = jsonReader.nextString();
                if ("".equals(value)) {
                    return null; //null로 설정
                }
                return NumberUtils.createNumber(value);
            } catch (NumberFormatException e) {
                throw new JsonSyntaxException(e);
            }
        }
    }

	public String getRequestIp() {
		return IpUtils.getRequestIp(request);
	}

}
