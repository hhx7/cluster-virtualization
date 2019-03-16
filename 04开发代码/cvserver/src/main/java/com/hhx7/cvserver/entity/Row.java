package com.hhx7.cvserver.entity;

import com.hhx7.cvserver.utils.Util;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class Row {
    private List<Double> row;

    public Row() {}
    public Row(List<Double> r) {
        this.row = r;
    }
    public List<Double> getRow() {
        return row;
    }

    public List<Double> getRowWithMask(Set<Integer> mask) {
        if (mask.isEmpty()){
            return row;
        }else {
            List<Double> r = new ArrayList<>();
            for (int i=0; i<row.size(); ++i){
                if (!mask.contains(i)){
                    r.add(row.get(i));
                }
            }
            return r;
        }
    }

    public void setRow(List<Double> row) {
        this.row = row;
    }

    public boolean removeColumn(Integer colIndex) {
        if (colIndex < row.size()){
            row.remove(colIndex);
            return true;
        }
        return false;

    }

    public boolean editValue(Integer colIndex, Double value){
        if (colIndex < row.size()){
            row.set(colIndex, value);
            return true;
        }
        return false;
    }

    public void push(Double value){
        row.add(value);
    }

    public Integer size(){
        return row.size();
    }
    @Override
    public String toString() {
        return Util.join(row, ",");
    }



}
