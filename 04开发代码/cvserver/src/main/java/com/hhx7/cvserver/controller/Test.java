package com.hhx7.cvserver.controller;




import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.LineNumberReader;
import java.util.List;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

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
    public @ResponseBody String uploadCsv(@RequestBody Csv csv) {
        try{
            String[] args1 = new String[] { "/home/pi/PycharmProjects/ml/venv/bin/python3", "/home/pi/PycharmProjects/ml/pca.py", csv.toCsvWithoutHeader()};

            Process pr=Runtime.getRuntime().exec(args1);
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    pr.getInputStream()));
            String line = null;
            while ((line = in.readLine()) != null) {
                System.out.println(line);
            }

            in.close();
            //pr.waitFor();
            System.out.println("end");
        }catch (Exception e){
            e.printStackTrace();
        }

    	return "{ res: \"ok\" }";
    }
    
}
