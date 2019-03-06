package com.hhx7.cvserver.entity;

import com.hhx7.cvserver.utils.Util;

import java.util.List;

public class Csv {
	private List<String> headers;

	private List<List<Double>> data;

	public List<String> getHeaders() {
		return headers;
	}

	public void setHeaders(List<String> headers) {
		this.headers = headers;
	}

	public List<List<Double>> getData() {
		return data;
	}

	public void setData(List<List<Double>> data) {
		this.data = data;
	}

	public String toCsvWithoutHeader(){
		StringBuilder builder = new StringBuilder();
		for (List<Double> row: data){
			builder.append(Util.join(row, ","));
			builder.append("\n");
		}
		return builder.toString();
	}

	@Override
	public String toString() {
		return "Csv{" +
				"headers=" + headers +
				", data=" + data +
				'}';
	}


	
}
