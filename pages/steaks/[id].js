import React from "react";
import { useRouter } from "next/router";
import { SingleItemView, Loading, Error } from "../../src/components/";
import { useGetSingleSteakQuery } from "../../src/redux/reducers/apiSlice";
import { motion } from "framer-motion";

export default function SingleSteakView() {
  const router = useRouter();
  const { id } = router.query;
  const response = useGetSingleSteakQuery(id);
  console.log(response)

  if (response.isLoading) {
    return <Loading />;
  } else if (response.isError) {
    return <Error type={500}/>;
  } else {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <SingleItemView data={response.data} type={"steaks"} />
      </motion.div>
    );
  }
}
