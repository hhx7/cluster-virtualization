package com.hhx7.cvserver.utils;

import java.util.ArrayList;
import java.util.List;

public class Util {

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
}
