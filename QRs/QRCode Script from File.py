import segno
import os
from urllib.parse import urlparse, parse_qs

input_file = "links.txt"

save_path = "outputs/"
qr_light = "#FFFFFF"
qr_dark = "#000000"
qr_scale = 40
qr_border = 2

os.makedirs(save_path, exist_ok=True)


with open(input_file, "r") as f:
    links = [line.strip() for line in f if line.strip()] 

for link in links:
    parsed_url = urlparse(link)
    domain_parts = parsed_url.netloc.split('.')

    
    if len(domain_parts) >= 3:
        domain = domain_parts[-3] + "." + domain_parts[-2]  
    else:
        domain = domain_parts[-2] if len(domain_parts) > 1 else domain_parts[0]

    
    qs = parse_qs(parsed_url.query)
    utm_source = qs.get("utm_source", [""])[0]
    utm_medium = qs.get("utm_medium", [""])[0]

    
    name_parts = [domain]
    if utm_source:
        name_parts.append(utm_source)
    if utm_medium:
        name_parts.append(utm_medium)
    file_name = "-".join(name_parts) + ".png"

    qr = segno.make_qr(link)
    qr.save(os.path.join(save_path, file_name),
            scale=qr_scale,
            border=qr_border,
            light=qr_light,
            dark=qr_dark)

print("QR codes generate successfully!")