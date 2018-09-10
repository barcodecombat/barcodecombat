function calcDistance (A,B){
  if (A != null && typeof A !== 'undefined' && B != null && typeof B !== 'undefined'){
    let distance = 0;
    let a = A.x - B.x;
    a = a * a;
    let b = A.y - B.y;
    b = b * b;
    distance = Math.sqrt(a+b);
    return distance;
  }
  return -1;
}
