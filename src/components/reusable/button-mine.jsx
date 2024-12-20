import ButtonSvg from "@/components/reusable/svg/ButtonSvg";
import ButtonGradient from "@/components/reusable/svg/ButtonGradient";


const ButtonMine = ({ className, href, onClick, children, px, white }) => {
    const classes = `button relative inline-flex items-center justify-center 
      h-11 transition-colors hover:text-ourGreen 
      ${px || "px-7"} 
      ${white ? "text-n-8" : "text-n-4"} 
      ${className || ""} 
      bg-transparent border-none rounded-tr-lg`;  // Transparent background and rounded top-right border

    const spanClasses = "relative z-10";

    // Render the button as a <button> element
    const renderButton = () => (
        <button className={classes} onClick={onClick}>
            <ButtonGradient />  {/* Include the gradient definitions */}
            <span className={spanClasses}>{children}</span>
            <ButtonSvg white={white} />  {/* Apply the gradient borders */}
        </button>
    );

    // Render the button as a <a> link
    const renderLink = () => (
        <a href={href} className={classes}>
            <ButtonGradient />  {/* Include the gradient definitions */}
            <span className={spanClasses}>{children}</span>
            <ButtonSvg white={white} />  {/* Apply the gradient borders */}
        </a>
    );

    return href ? renderLink() : renderButton();
};

export default ButtonMine;
