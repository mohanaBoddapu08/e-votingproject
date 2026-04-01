import React, { useContext, useEffect, useState } from "react";
import { TransactionContext } from "../../../context/TransactionContext";
import { Grid, Toolbar } from "@mui/material";
import ElectionResult from "../../../Components/Admin/ElectionResult";
import { getResult } from "../../../Data/Methods";
import { serverLink } from "../../../Data/Variables";
import axios from "axios";

const ViewResult = () => {

  const { getAllTransactions } = useContext(TransactionContext);
  const [result, setResult] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const transactions = await getAllTransactions();
        const electRes = await axios.get(serverLink + "elections");
        const allElections = electRes.data;

        const resultsMap = {};
        allElections.forEach(elec => {
           resultsMap[elec._id] = {
             election_id: elec._id,
             candidates: elec.candidates || [],
             vote: (elec.candidates || []).map(() => 0),
             title: elec.name || "Election"
           };
        });

        transactions.forEach(tx => {
           const eId = tx.election_id;
           const cId = tx.candidate_id;
           if (resultsMap[eId]) {
             const cIndex = resultsMap[eId].candidates.indexOf(cId);
             if (cIndex !== -1) {
                resultsMap[eId].vote[cIndex]++;
             }
           }
        });

        setResult(Object.values(resultsMap));
      } catch (err) {
        console.error("Error fetching results:", err);
      }
    }
    getData();
  }, [getAllTransactions]);

  return (
    <div className="admin__content">

      <ContentHeader />

      <div style={{ paddingBottom: 25 }}>

        <Toolbar>

          <Grid container pt={3} spacing={2}>

            {result &&
              result.map((item, index) => (

                <Grid item xs={6} md={4} key={index}>

                  <ElectionResult
                    index={index}
                    title={item.title || "Election"}
                    candidates={item.candidates}
                    info={item}
                    link={item.election_id}
                  />

                </Grid>

              ))}

          </Grid>

        </Toolbar>

      </div>

    </div>
  );
};

export default ViewResult;