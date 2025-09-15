
type Props = {
  size?: number; // px
  className?: string;
  title?: string; // accessible label
};


const IrisLogo = () => {
  return (
    <div className="h-11 shrink-0 w-11! flex border-cyan-800 border justify-center items-center rounded-full bg-gradient-to-tr from-cyan-900 to-transparent">
      <p className="font-semibold text-sm">IRIS</p>
    </div>
  )
}

export default IrisLogo
