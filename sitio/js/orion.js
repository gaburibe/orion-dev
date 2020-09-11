function csvIntoObject(text){
		obj={};
		counter=0;
		rows=text.split("\n");
		for(i=0;i<rows.length;i++){
			splitter=rows[i].split("\t");
			obj[i]=splitter;
		}
		return obj;
	}
