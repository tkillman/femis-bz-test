package kr.or.kicox.biz.fr.util;

import com.google.gson.Gson;
import org.postgresql.util.PGInterval;

import java.sql.SQLException;
import java.util.Map;
import java.util.UUID;

public class StringUtils {

    private StringUtils() {
    }

    public static PGInterval toInterval(Object interval) {
        try {
            return new PGInterval(interval.toString());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }


    public static boolean isEmpty(String str) {
        if (str == null || "".equals(str))
            return true;
        return false;
    }

    public static boolean isNotEmpty(String str) {
        return !isEmpty(str);
    }

    /**
     * 두문자열을 비교하여 같으면 true 다르면 false를 리턴한다.
     * null과 nullstring은 같은 것으로 취급한다.
     *
     * @param str1
     * @param str2
     * @return
     */
    public static boolean isEquals(String str1, String str2) {

        if (!isEmpty(str1)) {
            if (!isEmpty(str2)) {
                if (str1.equals(str2)) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            if (isEmpty(str2)) {
                return true;
            } else {
                return false;
            }
        }

    }
	/*
	public static String encrypt(String str) {
		if(isEmpty(str)) {
			return "";
		}
		return CryptUtil.Encrypt(str);
	}

	public static String decrypt(String str) {
		return CryptUtil.Decrypt(str);

	}
	*/

    /**
     * 맵 테이터를 json형태로 리턴한다.
     *
     * @param map
     * @return
     */
    public static String stringify(Map map) {
        Gson gson = new Gson();
        return gson.toJson(map);
    }


    public static String uuid() {
        UUID uuid = UUID.randomUUID();
        return uuid.toString();
    }


//	public static String convertTelNo(String telno) {
//
//		String[] ss = convertArrTelNo(telno);
//		StringBuffer ret = new StringBuffer();
//		ret.append(ss[0]);
//		if(  !isEmpty(ss[1]) ) {
//			ret.append("-");
//			ret.append(ss[1]);
//		}
//		if(  !isEmpty(ss[2]) ) {
//			ret.append("-");
//			ret.append(ss[2]);
//		}
//
//		return ret.toString();
//
//	}
//
//	public static String[] convertArrTelNo(String telno) {
//
//		String[] ss = {"","",""};
//		if(isEmpty(telno)) {
//			return ss;
//		}
//
//		telno =telno.replaceAll("_", "");
//
//		int size = telno.length();
//		if( telno.length()<=3 ) {
//			ss[0] = telno;
//			return ss;
//		}
//
//		if(telno.indexOf("02")==0) {
//			ss[0]="02";
//			telno = telno.substring(2);
//		}else {
//			ss[0]= telno.substring(0, 3);
//			telno = telno.substring(3);
//		}
//
//		if(telno.length()<5) {
//			ss[1] = telno;
//		}else if(telno.length()<8){
//			ss[1] = telno.substring(0, 3);
//			ss[2] = telno.substring(3);
//		}else {
//			ss[1] = telno.substring(0, 4);
//			ss[2] = telno.substring(4);
//		}
//
//		return ss;
//	}

//	public static void main(String[] args) {
//		System.out.println(StringUtils.convertTelNo("__02_4507315"));
//		System.out.println(StringUtils.convertTelNo("__031_4507315"));
//		System.out.println(StringUtils.convertTelNo("__031_45037315"));
//		System.out.println(StringUtils.convertTelNo("__02"));
//		System.out.println(StringUtils.convertTelNo("__0314445555"));
//	}

//	public static void main(String[] args) {
//
//		System.out.println(StringUtils.decrypt("100018012064107254")); //ssn
//		System.out.println(StringUtils.decrypt("100018012064107254"));
//		System.out.println(StringUtils.uuid());
//
//		System.out.println(StringUtils.encrypt("01094729510"));
//
//
//	}

    /**
     * Object가 널이면 ""를 리턴
     */
    public static String nvl(Object obj) {
        String rtn = "";
        if (obj != null) {
            rtn = obj.toString();
        }
        return rtn;
    }

    public static String path(String path) {
        if (path != null && path.contains("./")) {
            throw new IllegalArgumentException("invalid path: " + path);
        }

        return path;
    }

    public static String xss(String text) {
        if (isEmpty(text)) {
            return text;
        }

        final StringBuilder buildText = new StringBuilder();

        for (int i = 0; i < text.length(); i++) {
            char c = text.charAt(i);
            switch (c) {
                case '<':
                    buildText.append("&lt;");
                    break;
                /*case '>':
                    buildText.append("&gt;");
                    break;*/
                case '&':
                    buildText.append("&amp;");
                    break;
                case '"':
                    buildText.append("&quot;");
                    break;
                case '\'':
                    buildText.append("&apos;");
                    break;
                default:
                    buildText.append(c);
                    break;
            }
        }

        return buildText.toString();
    }
}
