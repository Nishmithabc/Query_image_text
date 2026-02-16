from paddleocr import PaddleOCR

ocr = PaddleOCR(use_angle_cls=True, lang='en')
result = ocr.ocr("img.jpeg")

text= " ".join([line[1][0] for line in result[0]])
