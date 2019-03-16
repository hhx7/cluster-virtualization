package com.hhx7.cvserver.controller;

import com.alibaba.fastjson.JSONObject;
import com.hhx7.cvserver.entity.Csv;
import com.hhx7.cvserver.entity.Wrapper;
import com.hhx7.cvserver.entity.Row;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/table")
public class Table {

    @RequestMapping(value = "/createRow", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody
    Map<String,Object> createRow(@RequestBody JSONObject json, HttpSession session) {

        Map<String, Object> map=new HashMap<String, Object>();
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            Integer index = json.getInteger("index");
            Row row  = new Row(json.getJSONArray("row").toJavaList(Double.class));
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
            Integer start = json.getInteger("start");
            Integer amount = json.getInteger("amount");
            csv.removeRow(start);
            map.put("res", "ok");
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
            Integer rowIndex = json.getInteger("rowIndex");
            String colId = json.getString("colId");
            Double value = json.getDoubleValue("value");
            Integer colIndex = csv.getColIndexFromColId(colId);

            if (csv.editCell(rowIndex, colIndex, value)){
                map.put("res", "ok");
            }
        }
        return map;
    }

    @RequestMapping(value = "/removeColumn", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody
    Map<String,Object> cellValueChanged(@RequestBody Wrapper<String> colId, HttpSession session) {

        Map<String, Object> map=new HashMap<String, Object>();
        map.put("res", "failed");
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            Integer colIndex = csv.getColIndexFromColId(colId.getValue());
            csv.removeColumn(colIndex);
            map.put("res", "ok");
        }
        return map;
    }

    @RequestMapping(value = "/addColumn", method = RequestMethod.POST, produces = "application/json")
    public @ResponseBody
    Map<String,Object> addColumn(@RequestBody Wrapper<String> colId, HttpSession session) {

        Map<String, Object> map=new HashMap<String, Object>();
        map.put("res", "failed");
        Csv csv = (Csv) session.getAttribute("csv");
        if (csv != null){
            csv.addColumn(colId.getValue());
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
            csv.showOrHideColumn(csv.getColIndexFromColId(colId), show);
            map.put("res", "ok");
        }
        return map;
    }
}
