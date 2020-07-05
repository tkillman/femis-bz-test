package kr.or.kicox.biz.fr.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

public class HashMapUtils {
	
	// Key 값의 대문자를 소문자로 변경
	public static List<HashMap<String, Object>> keyChangeLower(List<HashMap<String, Object>> list) {
		List<HashMap<String, Object>> newList = new LinkedList<HashMap<String, Object>>();

		for (int i = 0; i < list.size(); i++) {

			HashMap<String, Object> tm = new HashMap<String, Object>(list.get(i));

			Iterator<String> iteratorKey = tm.keySet().iterator(); // 키값 오름차순

			HashMap<String, Object>  newMap = new HashMap<String, Object>();

			// //키값 내림차순 정렬
			while (iteratorKey.hasNext()) {
				String key = iteratorKey.next();
				newMap .put(key.toLowerCase(), tm.get(key));
			}
			newList.add(newMap);
		}
		return newList;
	}
}
