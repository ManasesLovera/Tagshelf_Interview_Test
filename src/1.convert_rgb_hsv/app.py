import math

def rgbToHsv(r, g, b):
    r /= 255
    g /= 255
    b /= 255

    cMax = max(r, g, b)
    cMin = min(r, g, b)
    chroma = cMax - cMin

    h = 0
    h += ((g - b) / chroma) * (cMax == r)
    h += ((b - r) / chroma + 2) * (cMax == g)
    h += ((r - g) / chroma + 4) * (cMax == b)

    # to not use try/except
    S = chroma / cMax if cMax != 0 else 0

    V = cMax

    return [int(h), int(S), int(V)]

def hsvToRgb(h, s, v):
    h = h % 360

    C = v * s
    X = C * (1 - abs((h / 60) % 2 - 1))
    M = v - C

    HIndex = math.floor(h / 60) % 6

    R = 0 + C * (HIndex == 0 or HIndex == 5)
    R += X * (HIndex == 1 or HIndex == 4)
    G = 0 + C * (HIndex == 1 or HIndex == 2)
    G += X * (HIndex == 0 or HIndex == 3)
    B = 0 + C * (HIndex == 2 or HIndex == 3)
    B += X * (HIndex == 4 or HIndex == 5)

    return [
        round((R + M) * 255),
        round((G + M) * 255),
        round((B + M) * 255)
    ]

print(rgbToHsv(255,0,0)) # Returns [0, 1, 1]
print(hsvToRgb(0, 1, 1)) # Returns [255, 0, 0]