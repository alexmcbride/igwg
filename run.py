import pandas

df = pandas.read_csv('heroes.csv')

print '['
for index, row in df.iterrows():
    print '{'
    print '"title": "'+row['TITLE']+'",'
    print '"pub_dates": "'+str(row['PUBL/DATES'])+'",'
    print '"descript": "'+row['DESCRIPT.']+'",'
    print '"history": "'+row['HISTORY']+'",'
    print '"subject": "'+row['SUBJECT']+'",'
    print '"source": "'+row['SOURCE']+'",'
    print '"added_name": "'+str(row['ADDED NAME'])+'"'
    print '},'
print ']'
