package com.hhx7.cvserver.entity;

import com.hhx7.cvserver.utils.Util;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class Row {
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    private String id;
    private List<Double> data;

    public Row() {}
    public Row(List<Double> r) {
        this.data = r;
    }
    public List<Double> getData() {
        return data;
    }

    public List<Double> getRowWithMask(Set<Integer> mask) {
        if (mask.isEmpty()){
            return data;
        }else {
            List<Double> r = new ArrayList<>();
            for (int i = 0; i< data.size(); ++i){
                if (!mask.contains(i)){
                    r.add(data.get(i));
                }
            }
            return r;
        }
    }

    public void setData(List<Double> data) {
        this.data = data;
    }

    public boolean removeColumn(int colIndex) {
        if (colIndex < data.size()){
            data.remove(colIndex);
            return true;
        }
        return false;

    }

    public boolean editValue(Integer colIndex, Double value){
        if (colIndex < data.size()){
            data.set(colIndex, value);
            return true;
        }
        return false;
    }


    public void push(Double value){
        data.add(value);
    }

    public Integer size(){
        return data.size();
    }
    @Override
    public String toString() {
        return Util.join(data, ",");
    }



}
