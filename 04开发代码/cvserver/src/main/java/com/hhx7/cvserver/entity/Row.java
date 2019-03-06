package com.hhx7.cvserver.entity;

import com.hhx7.cvserver.utils.Util;

import java.util.List;

public class Row {
    public List<Double> getRow() {
        return row;
    }

    public void setRow(List<Double> row) {
        this.row = row;
    }

    @Override
    public String toString() {
        return Util.join(row, ",");
    }

    private List<Double> row;

}
