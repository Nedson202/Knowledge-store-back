const emailVerificationTemplate = ({
  redirectUrl, username, OTP, token
}) => {
  const template = `
    <div
    style="width:450px;
    display:block;
    margin: 0 auto;
    border-radius:5px;
    color:black;
    text-align: center; font-family: Times New Roman;"
    >
      <div
      style="font-size: 25px;
      height: 3rem; border: 1px solid #929292; border-radius: 5px; line-height: 3rem;"
      >Lorester's Bookstore</div>

      <div style="width: 400px; margin: auto;">
        <p style="font-size: 20px;">Welcome ${username}</p>
        <p>You are almost there.
        <br /> Click on the button below to confirm your email address</p>
        <a
        href="${redirectUrl}?verify-email=${token}"
        style="border: 1px solid #929292; padding: 10px; border-radius: 10px;
          color: #444444;
          cursor: pointer;
          width: 50%;
          display: block;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
          text-decoration: none"
          onMouseOver="this.style.boxShadow='1px 2px 2px rgba(0, 0, 0, 0.2)'"
          onMouseOut="this.style.boxShadow='none'">Confirm Email Address
        </a>
        <p>If you are using the mobile app, insert the following code into the
          verification screen.</p>
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

export default emailVerificationTemplate;
