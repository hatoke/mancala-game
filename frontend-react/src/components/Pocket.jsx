import "../assets/style/components/Pocket.scss";

function RenderStone({ stone }) {
  if (stone) {
    return [...Array(parseInt(stone)).keys()].map((_, index) => <div className="stone" key={index}></div>);
  }
}

function Pocket({ stone, clickEvent }) {
  const clickHandle = () => {
    if (clickEvent) {
      clickEvent();
    }
  };

  return (
    <div className="pocket" stone-count={stone} onClick={clickHandle}>
      <RenderStone stone={stone} />
    </div>
  );
}

export default Pocket;
