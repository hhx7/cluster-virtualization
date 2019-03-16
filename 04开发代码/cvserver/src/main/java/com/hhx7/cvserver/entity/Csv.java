package com.hhx7.cvserver.entity;

import com.hhx7.cvserver.utils.Util;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Csv {
	private List<String> headers;
	private Set<Integer> mask;
	private List<Row> data;

	public Csv() {
		mask = new HashSet<>();
	}
	public List<String> getHeaders() {
		return headers;
	}

	public void setHeaders(List<String> headers) {
		this.headers = headers;
	}

	public List<Row> getData() {
		return data;
	}

	public void setData(List<Row> data) {
		this.data = data;
	}

	public Boolean insertRow(Integer index, Row row) {
		try{
			data.add(index, row);
		}catch (IndexOutOfBoundsException e){
			return false;
		}
		return true;
	}

	public Boolean removeRow(Integer index) {
		try{
			data.remove(index);
		}catch (IndexOutOfBoundsException e){
			return false;
		}
		return true;
	}


	public String toCsvWithoutHeader(){
		StringBuilder builder = new StringBuilder();
		for (Row row: data){
			builder.append(Util.join(row.getRowWithMask(mask), ","));
			builder.append("\n");
		}
		return builder.toString();
	}

	public boolean editCell(Integer rowIndex, Integer colIndex, Double value) {
		if (rowIndex<data.size()){
			Row row = data.get(rowIndex);
			if (row.editValue(colIndex, value))
				return true;
		}

		return false;
	}

	public void removeColumn(Integer colIndex) {
		mask.remove(colIndex);
		headers.remove(colIndex);
		for (Row row: data) {
			row.removeColumn(colIndex);
		}
	}

	public void addColumn(String colId) {
		headers.add(colId);
		for (Row row: data){
			row.push(0.0);
		}
	}



	public void showOrHideColumn(Integer colId, Boolean show){
		if(show)
			mask.remove(colId);
		else
			mask.add(colId);
	}

	public Integer getColIndexFromColId(String colId) {
		return headers.indexOf(colId);
	}

	public Integer rowSize(){
		return data.size();
	}

	public Integer colSize() {
		return rowSize() > 0 ? data.get(0).size() : 0;
	}
	@Override
	public String toString() {
		return "Csv{" +
				"headers=" + headers +
				", data=" + data +
				'}';
	}


	
}
