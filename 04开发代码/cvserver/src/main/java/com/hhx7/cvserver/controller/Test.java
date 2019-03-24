package com.hhx7.cvserver.controller;




import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hhx7.cvserver.entity.Csv;
import com.hhx7.cvserver.entity.Row;
import com.hhx7.cvserver.utils.Util;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import static com.hhx7.cvserver.utils.Util.runPython;


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


    @RequestMapping(value = "/pca", produces = "text/plain")
    public @ResponseBody String pca(HttpSession session) {
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            String[] args = new String[] { Util.PYTHON_EXEC, Util.PYTHON_ROOT +"/pca.py", csv.toCsvWithoutHeader()};
            return runPython(args);
        }
        return "{ \"res\": \"failed\"}";
    }

    @RequestMapping(value = "/mds", produces = "text/plain")
    public @ResponseBody String mds(HttpSession session) {

        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            String[] args = new String[] { Util.PYTHON_EXEC, Util.PYTHON_ROOT +"/mds.py", csv.toCsvWithoutHeader()};

            return runPython(args);

        }

        return "{ \"res\": \"failed\"}";
    }
    @RequestMapping(value = "/kmeans", produces = "text/plain")
    public @ResponseBody String kmeans(@RequestBody JSONObject json, HttpSession session) {
        Integer maxCluster = json.getInteger("maxCluster");
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            String[] args = new String[] { Util.PYTHON_EXEC, Util.PYTHON_ROOT +"/kmeans.py", maxCluster.toString(), csv.toCsvWithoutHeader()};

            return runPython(args);
        }
        return "{ \"res\": \"failed\"}";
    }

    @RequestMapping(value = "/anova", produces = "text/plain")
    public @ResponseBody String anova(@RequestBody JSONObject json, HttpSession session) {

        String[] args = new String[] { Util.PYTHON_EXEC, Util.PYTHON_ROOT +"/anova.py",  json.toJSONString()};
        return runPython(args);
    }

    
}
