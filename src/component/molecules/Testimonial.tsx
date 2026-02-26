import Image from "next/image";
import Typography from "@/component/atoms/Typography";
import "@/component/molecules/css/Testimonial.css";

export type TestimonialProps = {
  image: string;
  name: string;
  testimonial: string;
  withBackground?: boolean;
};

export default function Testimonial({
  image,
  name,
  testimonial,
  withBackground,
}: TestimonialProps) {
  return (
    <div
      className={`testimonial-container ${withBackground ? "testimonial-background" : ""}`}
    >
      <Image src={image} alt="Testimonial Image" width={100} height={100} />
      <Typography variant="heading">{name}</Typography>
      <Typography variant="text">{testimonial}</Typography>
    </div>
  );
}
