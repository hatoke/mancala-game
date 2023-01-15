import "../assets/style/components/Pocket.scss";

function RenderStone({ stone }) {
  if (stone) {
    return [...Array(parseInt(stone)).keys()].map((_, index) => <div className="stone" key={index}></div>);
  }
}

function Pit({ stone, pitSelection }) {
  const clickHandle = () => {
    if (pitSelection) {
      pitSelection();
    }
  };

  return (
    <div className="pocket" stone-count={stone} onClick={clickHandle}>
      <RenderStone stone={stone} />
    </div>
  );
}

export default Pit;
