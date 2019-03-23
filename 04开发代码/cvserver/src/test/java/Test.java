import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hhx7.cvserver.utils.Util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

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
        String json = "{\"x1\":[56.7048577,56.7049627,56.7060783,56.7061408,56.7060927,56.7059663],\"x2\":[57.0106364,57.0099725,57.2248671,57.2247336,57.2245245,57.2242805,57.2241121,57.2241005,57.2241179,57.2240772,57.2240555,57.224054,57.2240192,57.2239154,57.223686]}";
        String[] args = new String[] { "/home/pi/PycharmProjects/ml/venv/bin/python3", "/home/pi/PycharmProjects/ml/anova.py",  json};
        String res = runPython(args);
        System.out.println(res);
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
