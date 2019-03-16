package com.hhx7.cvserver.controller;




import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hhx7.cvserver.entity.Csv;
import com.hhx7.cvserver.entity.Row;
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

    @RequestMapping(value = "/test", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody Map<String,Object> uploadCsv(@RequestBody JSONObject json) {


        Map<String, Object> map=new HashMap<String, Object>();
        try{
            Integer i = json.getInteger("index");
            Row row  = new Row(json.getJSONArray("row").toJavaList(Double.class));
            System.out.println(row.getRow());
            map.put("res", "ok");
        }catch (Exception e){
            e.printStackTrace();
            map.put("res", "failed");
        }
        return map;
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
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            String[] args = new String[] { "/home/pi/PycharmProjects/ml/venv/bin/python3", "/home/pi/PycharmProjects/ml/pca.py", csv.toCsvWithoutHeader()};

            String res = runPython(args);
            map.put("res",JSON.parseArray(res));
        }
        return map;
    }

    @RequestMapping(value = "/mds", produces = "application/json")
    public @ResponseBody Map<String,Object> mds(HttpSession session) {
        Map<String, Object> map=new HashMap<String, Object>();
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            String[] args = new String[] { "/home/pi/PycharmProjects/ml/venv/bin/python3", "/home/pi/PycharmProjects/ml/mds.py", csv.toCsvWithoutHeader()};

            String res = runPython(args);
            map.put("res",JSON.parseArray(res));
        }

        return map;
    }
    @RequestMapping(value = "/kmeans", produces = "application/json")
    public @ResponseBody Map<String,Object> kmeans(@RequestBody JSONObject json, HttpSession session) {
        Integer maxCluster = json.getInteger("maxCluster");
        Map<String, Object> map=new HashMap<String, Object>();
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            String[] args = new String[] { "/home/pi/PycharmProjects/ml/venv/bin/python3", "/home/pi/PycharmProjects/ml/kmeans.py", maxCluster.toString(), csv.toCsvWithoutHeader()};
            String res = runPython(args);
            map.put("res",JSON.parseArray(res));
        }
        return map;
    }

    private String runPython(String[] args) {
        StringBuilder res = new StringBuilder();
        try{
            Process pr=Runtime.getRuntime().exec(args);
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    pr.getInputStream()));
            String line = null;
            while ((line = in.readLine()) != null) {
                res.append(line);
            }
            in.close();
            //pr.waitFor();
        }catch (Exception e){
            e.printStackTrace();
            res.append("failed");
        }
        return res.toString();
    }
    
}
