package kr.or.kicox.biz.cm.menu.controller;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import kr.or.kicox.biz.fr.constant.RequestAttributeName;

/**
 * @author : 
 * @Class Name  : MenuController.java
 * @Description : 메뉴를 관리한다.
 * @Modification Information
 * <p>
 * 수정일      수정자   수정내용
 * ---------------------------------------------------------------
 * 2019.11.26  name    최초생성
 */
@Controller
public class MenuController {

    private static final Logger LOGGER = LoggerFactory.getLogger(MenuController.class);
    
	/**
     * 메뉴아이디를 통하여 팝업화면을 호출한다.
     *
     * @param menuId
     * @return
     * @throws Exception
     */
    @RequestMapping(value = "/popup/{biz}/{fileName}.do")
    public String popup(HttpServletRequest request, @PathVariable String biz, @PathVariable String fileName, ModelMap model) throws Exception {

        request.setAttribute(RequestAttributeName.WRITABLE, true); //활성화 된 메뉴 에서 쓰기 권한
        model.addAttribute("contextPath", request.getContextPath());
        model.addAttribute("biz", biz);
        model.addAttribute("fileName", fileName);
        
        return "template/popup";

    }
  
}
