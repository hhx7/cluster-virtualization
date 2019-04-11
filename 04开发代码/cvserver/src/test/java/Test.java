import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hhx7.cvserver.utils.Util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Test {
    public static <Type> String join(List<Type> list, String deli){
        StringBuilder res = new StringBuilder();
        for (int i=0; i<list.size(); ++i){
            res.append(list.get(i).toString());
            if (i != list.size()-1)
                res.append(deli);
        }
        return res.toString();
    }

    @org.junit.Test
    public void test(){
     List<Integer> test = new ArrayList<>();
     test.add(1);
     test.add(2);
     test.add(3);

     for (int i=0;i<test.size();++i){
         test.set(i, 4);
     }
     System.out.println(test);
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
