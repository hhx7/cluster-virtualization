package com.hhx7.cvserver.controller;




import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hhx7.cvserver.entity.Csv;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping("/home")
public class Test {

    //映射一个action
    @RequestMapping("/index")
    public  String index(){

        //返回一个index.jsp这个视图
        return "index";
    }
     
   
    @RequestMapping(value = "/uploadCsv", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody Map<String,Object> uploadCsv(@RequestBody Csv csv,HttpSession session) {

        Map<String, Object> map=new HashMap<String, Object>();
        try{
            session.setAttribute("csv", csv);
            map.put("res", "ok");
        }catch (Exception e){
            e.printStackTrace();
            map.put("res", "failed");
        }
    	return map;
    }


    @RequestMapping(value = "/pca", produces = "application/json")
    public @ResponseBody Map<String,Object> pca(HttpSession session) {
        Map<String, Object> map=new HashMap<String, Object>();
        try{
            Csv csv = (Csv) session.getAttribute("csv");

            if (csv != null){
                String[] args1 = new String[] { "/home/pi/PycharmProjects/ml/venv/bin/python3", "/home/pi/PycharmProjects/ml/pca.py", csv.toCsvWithoutHeader()};

                Process pr=Runtime.getRuntime().exec(args1);
                BufferedReader in = new BufferedReader(new InputStreamReader(
                        pr.getInputStream()));
                String line = null;
                StringBuilder res = new StringBuilder();
                while ((line = in.readLine()) != null) {
                    res.append(line);
                }

                System.out.println(res);

                in.close();
                //pr.waitFor();
                map.put("res",JSON.parseArray(res.toString()));
            }

        }catch (Exception e){
            e.printStackTrace();
            map.put("res","failed");
        }

        return map;
    }

    @RequestMapping(value = "/mds", produces = "application/json")
    public @ResponseBody Map<String,Object> mds(HttpSession session) {
        Map<String, Object> map=new HashMap<String, Object>();
        try{
            Csv csv = (Csv) session.getAttribute("csv");

            if (csv != null){
                String[] args1 = new String[] { "/home/pi/PycharmProjects/ml/venv/bin/python3", "/home/pi/PycharmProjects/ml/mds.py", csv.toCsvWithoutHeader()};

                Process pr=Runtime.getRuntime().exec(args1);
                BufferedReader in = new BufferedReader(new InputStreamReader(
                        pr.getInputStream()));
                String line = null;
                StringBuilder res = new StringBuilder();
                while ((line = in.readLine()) != null) {
                    res.append(line);
                }

                System.out.println(res);

                in.close();
                //pr.waitFor();
                map.put("res",JSON.parseArray(res.toString()));
            }

        }catch (Exception e){
            e.printStackTrace();
            map.put("res","failed");
        }

        return map;
    }
    
}
