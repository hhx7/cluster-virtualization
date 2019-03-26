package com.hhx7.cvserver.entity;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.hhx7.cvserver.utils.Util;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Csv {
	private List<String> headers;
	private Set<Integer> mask;
	private List<Row> rows;

	public Csv() {
		mask = new HashSet<>();
	}
	public List<String> getHeaders() {
		return headers;
	}

	public void setHeaders(List<String> headers) {
		this.headers = headers;
	}

	public List<Row> getRows() {
		return rows;
	}

	public void setRows(List<Row> rows) {
		this.rows = rows;
	}

	public Boolean insertRow(Integer index, Row row) {
		try{
			rows.add(index, row);
		}catch (IndexOutOfBoundsException e){
			return false;
		}
		return true;
	}
	public void addRow(Row row) {
		rows.add(row);
	}

	public Boolean removeRow(Integer index) {
		try{
			rows.remove(index);
		}catch (IndexOutOfBoundsException e){
			return false;
		}
		return true;
	}


	public String toCsvWithoutHeader(){
		StringBuilder builder = new StringBuilder();
		for (Row row: rows){
			builder.append(Util.join(row.getRowWithMask(mask), ","));
			builder.append("\n");
		}
		return builder.toString();
	}

	public String getIdAndDataJsonWithHeaders() {
		List<String> ids = new ArrayList<>();
		List<List<Double>> data = new ArrayList<>();
		List<String> nheaders = new ArrayList<>();
		for (Row row :rows){
			ids.add(row.getId());
			data.add(row.getRowWithMask(mask));
		}
		for (int i=0; i<headers.size(); ++i){
			if (!mask.contains(i)) {
				nheaders.add(headers.get(i));
			}
		}
		JSONObject json = new JSONObject();
		json.put("id", ids);
		json.put("data", data);

		json.put("headers", nheaders);
		return json.toJSONString();
	}

	public List<Row> getRowsById(List<String> ids){
		Set<String> idsset = new HashSet<>(ids);
		List<Row> data = new ArrayList<>();
		for (Row row: rows){
			if (idsset.contains(row.getId())){
				data.add(row);
			}
		}
		return data;
	}

	public List<Double> getColumnById(List<String> ids, String colId){
		List<Row> selectedRows = getRowsById(ids);
		List<Double> column = new ArrayList<>();
		Integer colIndex = getColIndexFromColId(colId);
		for (Row row: selectedRows){
			column.add(row.getData().get(colIndex));
		}
		return column;
	}

	public String getIdAndDataJsonWithoutHeaders() {
		List<String> ids = new ArrayList<>();
		List<List<Double>> data = new ArrayList<>();
		for (Row row :rows){
			ids.add(row.getId());
			data.add(row.getRowWithMask(mask));
		}
		JSONObject json = new JSONObject();
		json.put("id", ids);
		json.put("data", data);
		return json.toJSONString();
	}

	public boolean editCell(String id, Integer colIndex, Double value) {
		Row row = getRowById(id);
		if (row!=null){
			if (row.editValue(colIndex, value))
				return true;
		}
		return false;
	}

	public void removeColumn(String colId) {
		int colIndex = getColIndexFromColId(colId);
		mask.remove(colIndex);
		headers.remove(colIndex);
		for (Row row: rows) {
			row.removeColumn(colIndex);
		}
	}

	private Row getRowById(String id) {
		for (Row row: rows){
			if (row.getId().equals(id)){
				return row;
			}

		}
		return null;
	}
	public void addColumn(String colId) {
		headers.add(colId);
		for (Row row: rows){
			row.push(0.0);
		}
	}

	public String toJsonWithoutHeaders() {
		return JSON.toJSONString(this.rows);
	}

	public void showOrHideColumn(String colId, Boolean show){
		int colIndex = getColIndexFromColId(colId);
		if(show)
			mask.remove(colIndex);
		else
			mask.add(colIndex);
		System.out.println(mask);
	}

	public Integer getColIndexFromColId(String colId) {
		return headers.indexOf(colId);
	}

	public boolean removeRowById(String id) {
		for (int i=0; i<rows.size(); ++i){
			if (rows.get(i).getId().equals(id)){
				rows.remove(i);
				return true;
			}
		}
		return false;
	}

	public Integer rowSize(){
		return rows.size();
	}

	public Integer colSize() {
		return rowSize() > 0 ? rows.get(0).size() : 0;
	}
	@Override
	public String toString() {
		return "Csv{" +
				"headers=" + headers +
				", rows=" + rows +
				'}';
	}


	
}
