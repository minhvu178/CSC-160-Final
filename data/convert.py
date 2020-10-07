def main():
	f = open("Electricity-Renewable.csv")
	new_file = open("myfile.csv", "w")

	for line in f:
		line_list = line.split(",")
		for i in range(len(line_list)):
			if '"' in line_list[i]:
				line_list[i] = line_list[i].replace('"', "")

			if isint(line_list[i]):
				line_list[i] = int(line_list[i])
		new_line = ''
		for i in range(len(line_list)):
			if i == len(line_list)-1:
				new_line += str(line_list[i])
			else:
				new_line += str(line_list[i])
				new_line += ','
		new_file.write("%s\n" % new_line)

def isint(string):
	try:
		a = int(string)
	except ValueError:
		return False
	else:
		return True



main()