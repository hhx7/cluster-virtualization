package com.hhx7.cvserver.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class Util {
    public static String PYTHON_ROOT = "/home/pi/Desktop/pi/clustering/cluster-virtualization/04开发代码/python";
    public static String PYTHON_EXEC = PYTHON_ROOT +"/venv/bin/python3";
    public static <Type> String join(List<Type> list, String deli){
        StringBuilder res = new StringBuilder();
        for (int i=0; i<list.size(); ++i){
            Type e = list.get(i);
            if (e == null){
                continue;
            }
            res.append(e.toString());
            if (i != list.size()-1)
                res.append(deli);
        }
        return res.toString();
    }

    public static List<List<Double>> strToList(String s){

        List<List<Double>> res = new ArrayList<>();

        return res;
    }

    public static String runPython(String[] args) {
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
