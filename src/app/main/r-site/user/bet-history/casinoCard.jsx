function CasinoCard(props) {
  // console.log(props)
  const { card } = props;
  const { index } = props;
  const { result } = props;
  const { rotate } = props;
  return (
    <>
      {card == "2C" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">2</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="heart" />
          </span>
          <span className="numbers_tag rotate">2</span>
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
      {card == "2D" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">2</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">2</span>
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
      {card == "2H" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">2</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">2</span>
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
      {card == "2S" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">2</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">2</span>

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
      {card == "3C" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">3</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">3</span>

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
      {card == "3D" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">3</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">3</span>

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
      {card == "3H" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">3</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">3</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/3H.png`}
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
      {card == "3S" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">3</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">3</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/3S.png`}
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
      {card == "4C" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">4</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">4</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/4C.png`}
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
      {card == "4D" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">4</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">4</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/4D.png`}
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
      {card == "4H" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">4</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">4</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/4H.png`}
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
      {card == "4S" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">4</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">4</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/5S.png`}
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
      {card == "5C" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">5</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">5</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/5C.png`}
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
      {card == "5D" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">5</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">5</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/5D.png`}
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
      {card == "5H" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">5</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">5</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/5H.png`}
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
      {card == "5S" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">5</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">5</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/5S.png`}
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
      {card == "6C" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">6</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">6</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/6C.png`}
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
      {card == "6D" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">6</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">6</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/6D.png`}
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
      {card == "6H" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">6</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">6</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/6H.png`}
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
      {card == "6S" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">6</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">6</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/6S.png`}
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
      {card == "7C" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">7</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">7</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/7C.png`}
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
      {card == "7D" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">7</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">7</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/7D.png`}
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
      {card == "7H" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">7</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">7</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/7H.png`}
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
      {card == "7S" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">7</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">7</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/7S.png`}
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
      {card == "8C" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">8</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">8</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/8C.png`}
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
      {card == "8D" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">8</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">8</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/8D.png`}
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
      {card == "8H" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">8</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">8</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/8H.png`}
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
      {card == "8S" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">8</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">8</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/8S.png`}
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
      {card == "9C" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">9</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">9</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/9C.png`}
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
      {card == "9D" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">9</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">9</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/9D.png`}
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
      {card == "9H" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">9</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">9</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/9H.png`}
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
      {card == "9S" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">9</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">9</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/9S.png`}
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
      {card == "TC" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">10</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">10</span>

          {/* <img
          key={index}
          src={`assets/images/casino-card-images/TC.png`}
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
      {card == "TD" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">10</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">10</span>
          {/* <img
            key={index}
            src={`assets/images/casino-card-images/TD.png`}
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
      {card == "TH" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">10</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">10</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/TH.png`}
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
      {card == "TS" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">10</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">10</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/TS.png`}
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
      {card == "AC" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">A</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">A</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/AC.png`}
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
      {card == "AD" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">A</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">A</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/AD.png`}
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
      {card == "AH" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">A</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">A</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/AH.png`}
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
      {card == "AS" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">A</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">A</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/AS.png`}
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
      {card == "JC" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">J</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">J</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/JC.png`}
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
      {card == "JD" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">J</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">J</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/JD.png`}
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
      {card == "JH" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">J</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">J</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/JH.png`}
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
      {card == "JS" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">J</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">J</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/JS.png`}
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
      {card == "KC" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">K</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">K</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/KC.png`}
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
      {card == "KD" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">K</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">K</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/KD.png`}
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
      {card == "KH" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">K</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">K</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/KH.png`}
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
      {card == "KS" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">K</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">K</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/KS.png`}
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
      {card == "QC" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">Q</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/tree.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">Q</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/QC.png`}
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
      {card == "QD" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">Q</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/rect.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">Q</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/QD.png`}
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
      {card == "QH" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 red" : "casino_card red"
          }>
          <span className="numbers_tag">Q</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/heart.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">Q</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/QH.png`}
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
      {card == "QS" && (
        <div
          // style={
          //   rotate
          //     ? null
          //     : {
          //         flex: "1",
          //         display: "flex",
          //         flexDirection: "row",
          //         maxHeight: "22px",
          //         minWidth: "45px",
          //         gap: "8px",
          //         padding: "5px",
          //       }
          // }
          className={
            result == "player" ? "casino_card1 black" : "casino_card black"
          }>
          <span className="numbers_tag">Q</span>
          <span className="card_icon">
            <img src={`assets/images/casino_card/black.svg`} alt="rect" />
          </span>
          <span className="numbers_tag rotate">Q</span>
          {/* <img
          key={index}
          src={`assets/images/casino-card-images/QS.png`}
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
export default CasinoCard;
