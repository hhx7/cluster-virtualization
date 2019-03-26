package com.hhx7.cvserver.controller;

import com.alibaba.fastjson.JSONObject;
import com.hhx7.cvserver.entity.Csv;
import com.hhx7.cvserver.entity.Wrapper;
import com.hhx7.cvserver.entity.Row;
import com.hhx7.cvserver.utils.Util;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

import static com.hhx7.cvserver.utils.Util.runPython;

@Controller
@RequestMapping("/table")
public class Table {

    @RequestMapping(value = "/createRow", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody
    Map<String,Object> createRow(@RequestBody Row row, HttpSession session) {

        Map<String, Object> map=new HashMap<String, Object>();
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
//            Integer index = json.getInteger("index");
//            Row row  = new Row(json.getJSONArray("row").toJavaList(Double.class));
            csv.addRow(row);
            map.put("res", "ok");
        }else {
            map.put("res", "failed");
        }
        return map;
    }

    @RequestMapping(value = "/removeRow", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody
    Map<String,Object> removeRow(@RequestBody JSONObject json, HttpSession session) {

        Map<String, Object> map=new HashMap<String, Object>();
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            String id = json.getString("id");

            if (csv.removeRowById(id)){
                map.put("res", "ok");
            }else {
                map.put("res", "failed");
            }
        }else {
            map.put("res", "failed");
        }
        return map;
    }

    @RequestMapping(value = "/cellValueChanged", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody
    Map<String,Object> cellValueChanged(@RequestBody JSONObject json, HttpSession session) {

        Map<String, Object> map=new HashMap<String, Object>();
        map.put("res", "failed");
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            String id = json.getString("id");
            String colId = json.getString("colId");
            Double value = json.getDoubleValue("value");
            Integer colIndex = csv.getColIndexFromColId(colId);

            if (csv.editCell(id, colIndex, value)){
                map.put("res", "ok");
            }
        }
        return map;
    }

    @RequestMapping(value = "/removeColumn", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody
    Map<String,Object> removeColumn(@RequestBody JSONObject json, HttpSession session) {

        Map<String, Object> map=new HashMap<String, Object>();
        map.put("res", "failed");
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){

            csv.removeColumn(json.getString("colId"));
            map.put("res", "ok");
        }

        return map;
    }

    @RequestMapping(value = "/addColumn", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody
    Map<String,Object> addColumn(@RequestBody JSONObject json, HttpSession session) {

        Map<String, Object> map=new HashMap<String, Object>();
        map.put("res", "failed");
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            csv.addColumn(json.getString("colId"));
            map.put("res", "ok");
        }
        return map;
    }


    @RequestMapping(value = "/showOrHideColumn", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody
    Map<String,Object> showOrHideColumn(@RequestBody JSONObject json, HttpSession session) {

        Map<String, Object> map=new HashMap<String, Object>();
        map.put("res", "failed");
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            String colId = json.getString("colId");
            Boolean show = json.getBoolean("show");
            csv.showOrHideColumn(colId, show);
            map.put("res", "ok");
        }

        return map;
    }

    @RequestMapping(value = "/corrcoef", method = RequestMethod.GET, produces = "text/plain")
    public @ResponseBody
    String corrcoef(HttpSession session) {
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null) {
            String[] args = new String[] {Util.PYTHON_EXEC, Util.PYTHON_ROOT +"/corrcoef.py",  csv.toCsvWithoutHeader()};
            return runPython(args);
        }
        return "{ \"res\": \"failed\"}";
    }
}
