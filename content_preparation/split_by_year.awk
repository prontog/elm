#! /usr/bin/awk -f

/^##\s+[0-9]{4}/ {
	match($0, /^##\s+(.*)/, results)
	year = results[1]
	if (year) {
		f = sprintf("%s.html.md", year)
		print "---" > f
		print "activity:", act > f
		print "year:", year > f
		print "description: " > f
		print "---" > f
		
		next
	}
}
f {
	print $0 > f	
}