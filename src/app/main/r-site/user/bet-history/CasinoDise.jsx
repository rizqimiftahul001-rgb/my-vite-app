function CasinoDise(props) {
    // console.log(props)
    const { card } = props;
    const { index } = props;
    const { result } = props;
    const { rotate } = props;
    return (
      <>
        {card == "1" && (
          <div
            style={
              rotate
                ? null
                : {
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    maxHeight: "22px",
                    minWidth: "45px",
                    gap: "8px",
                    padding: "5px",
                  }
            }
            className={
              result === "player" || result === "Player" ? "casino_card1 red" : "casino_card red"
            }>
            {/* <span className="numbers_tag">2</span> */}
            <span className="card_icon">
              <img src={`assets/images/disc_image/1.svg`} alt="heart" />
            </span>
            {/* <img
              key={index}
              src={`assets/images/casino-card-images/2C.png`}
              alt="Image"
              style={{
                marginLeft: index !== 0 ? "2px" : 0,
                maxWidth: "30px",
                height: "auto",
                transform: index === 2 ? "rotate(90deg)" : "none",
                marginRight: index !== 2 ? "10px" : 0,
              }}
            /> */}
          </div>
        )}
        {card == "2" && (
          <div
            style={
              rotate
                ? null
                : {
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    maxHeight: "22px",
                    minWidth: "45px",
                    gap: "8px",
                    padding: "5px",
                  }
            }
            className={
              result === "player" || result === "Player" ? "casino_card1 red" : "casino_card red"
            }>
            {/* <span className="numbers_tag">2</span> */}
            <span className="card_icon">
              <img src={`assets/images/disc_image/2.svg`} alt="rect" />
            </span>
            {/* <img
            key={index}
            src={`assets/images/casino-card-images/2D.png`}
            alt="Image"
            style={{
              marginLeft: index !== 0 ? "2px" : 0,
              maxWidth: "30px",
              height: "auto",
              transform: index === 2 ? "rotate(90deg)" : "none",
              marginRight: index !== 2 ? "10px" : 0,
            }}
          /> */}
          </div>
        )}
        {card == "3" && (
          <div
            style={
              rotate
                ? null
                : {
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    maxHeight: "22px",
                    minWidth: "45px",
                    gap: "8px",
                    padding: "5px",
                  }
            }
            className={
              result === "player" || result === "Player" ? "casino_card1 red" : "casino_card red"
            }>
            {/* <span className="numbers_tag">2</span> */}
            <span className="card_icon">
              <img src={`assets/images/disc_image/3.svg`} alt="rect" />
            </span>
            {/* <img
            key={index}
            src={`assets/images/casino-card-images/2H.png`}
            alt="Image"
            style={{
              marginLeft: index !== 0 ? "2px" : 0,
              maxWidth: "30px",
              height: "auto",
              transform: index === 2 ? "rotate(90deg)" : "none",
              marginRight: index !== 2 ? "10px" : 0,
            }}
          /> */}
          </div>
        )}
        {card == "4" && (
          <div
            style={
              rotate
                ? null
                : {
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    maxHeight: "22px",
                    minWidth: "45px",
                    gap: "8px",
                    padding: "5px",
                  }
            }
            className={
              result === "player" || result === "Player" ? "casino_card1 red" : "casino_card red"
            }>
            {/* <span className="numbers_tag">2</span> */}
            <span className="card_icon">
              <img src={`assets/images/disc_image/4.svg`} alt="rect" />
            </span>
            {/* <img
            key={index}
            src={`assets/images/casino-card-images/2S.png`}
            alt="Image"
            style={{
              marginLeft: index !== 0 ? "2px" : 0,
              maxWidth: "30px",
              height: "auto",
              transform: index === 2 ? "rotate(90deg)" : "none",
              marginRight: index !== 2 ? "10px" : 0,
            }}
          /> */}
          </div>
        )}
        {card == "5" && (
          <div
            style={
              rotate
                ? null
                : {
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    maxHeight: "22px",
                    minWidth: "45px",
                    gap: "8px",
                    padding: "5px",
                  }
            }
            className={
              result === "player" || result === "Player" ? "casino_card1 red" : "casino_card red"
            }>
            {/* <span className="numbers_tag">3</span> */}
            <span className="card_icon">
              <img src={`assets/images/disc_image/5.svg`} alt="rect" />
            </span>
  
            {/* <img
              key={index}
              src={`assets/images/casino-card-images/3C.png`}
              alt="Image"
              style={{
                marginLeft: index !== 0 ? "2px" : 0,
                maxWidth: "30px",
                height: "auto",
                transform: index === 2 ? "rotate(90deg)" : "none",
                marginRight: index !== 2 ? "10px" : 0,
              }}
            /> */}
          </div>
        )}
        {card == "6" && (
          <div
            style={
              rotate
                ? null
                : {
                    flex: "1",
                    display: "flex",
                    flexDirection: "row",
                    maxHeight: "22px",
                    minWidth: "45px",
                    gap: "8px",
                    padding: "5px",
                  }
            }
            className={
              result === "player" || result === "Player" ? "casino_card1 red" : "casino_card red"
            }>
            {/* <span className="numbers_tag">3</span> */}
            <span className="card_icon">
              <img src={`assets/images/disc_image/6.svg`} alt="rect" />
            </span>
            {/* <img
            key={index}
            src={`assets/images/casino-card-images/3D.png`}
            alt="Image"
            style={{
              marginLeft: index !== 0 ? "2px" : 0,
              maxWidth: "30px",
              height: "auto",
              transform: index === 2 ? "rotate(90deg)" : "none",
              marginRight: index !== 2 ? "10px" : 0,
            }}
          /> */}
          </div>
        )}
      </>
    );
  }
  export default CasinoDise;
  