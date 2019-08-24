const resendOTPTemplate = ({ username, OTP }) => {
  const template = `
    <div
      style="width:450px;
      display:block;
      margin: 0 auto;
      border-radius:5px;
      color:black;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center; font-family: Times New Roman;"
      >
      <div
      style="font-size: 25px;
      height: 3rem; border: 1px solid #929292; border-radius: 5px; line-height: 3rem;"
      >Lorester's Bookstore</div>

      <div style="width: 400px; margin: auto;">
        <p style="font-size: 20px;">Hello ${username}, you requested for a new OTP.</p>
        <p>Insert the following code into the verification screen.</p>
        <span
        style="font-size: 25px;"
        >
          <strong>${OTP}</strong>
        </span>
      </div>

      <div style="height: 3rem; border: 1px solid #929292; border-radius: 5px;
      margin-top: 25px">
        <span
          style="line-height: 3rem;"
        >Need support? Contact knowledgestore@gmail.com</span>
      </div>
    </div>
  `;

  return template;
};

export default resendOTPTemplate;
