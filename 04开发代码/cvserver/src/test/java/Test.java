import com.hhx7.cvserver.utils.Util;

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
        List<Double> sublist = new ArrayList<>();
        sublist.add(1.0);
        sublist.add(2.0);
        List<List<Double>> list = new ArrayList<>();
        list.add(sublist);
        list.add(sublist);

        StringBuilder builder = new StringBuilder();
        for (List<Double> row: list){
            builder.append(Util.join(row, ","));
            builder.append("\n");
        }

        System.out.println(builder.toString());
    }
}
