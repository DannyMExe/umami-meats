import React from "react";
import { useRouter } from "next/router";
import { SingleItemView, Loading, Error } from "../../src/components/";
import { useGetSingleSushiQuery } from "../../src/redux/reducers/apiSlice";
import { motion } from "framer-motion";

export default function SingleSushiView() {
  const router = useRouter();
  const { id } = router.query;
  const { data } = useGetSingleSushiQuery(id);

  if (data === undefined) {
    return <Loading />;
  } else if (data === null) {
    return <Error />;
  } else {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SingleItemView data={data} type={"sushi"} />
      </motion.div>
    );
  }
}
