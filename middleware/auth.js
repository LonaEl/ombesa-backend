import jwt from "jsonwebtoken";


const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const isCustomAuth = token.length < 500;

    let decodedData;

    if (token && isCustomAuth) {      
      decodedData = jwt.verify(token, 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiT3duZXIiLCJJc3N1ZXIiOiJOb2lzc3VlIiwiVXNlcm5hbWUiOiJOb3VzZSIsImV4cCI6MjM5NjQ0MzM2NCwiaWF0IjoxNjcxODA2NTY0fQ.i89nIYQz0qxR6QxTPQLmeRtHTJ1vDVhSvWlAkNBlSto');

      req.userId = decodedData?.id;
    } else {
      decodedData = jwt.decode(token);

      req.userId = decodedData?.sub;
    }    

    next();
  } catch (error) {
    console.log(error);
  }
};

export default auth;


