const createTransactionQuery = `MERGE (t:Transaction {id: $id}) SET t.amount = $amount, t.ip = $ip, t.deviceId = $deviceId`;
const linkSenderToTransactionQuery = `MATCH (u:User {id: $senderId}), (t:Transaction {id: $id}) MERGE (u)-[:DEBIT]->(t)`;
const linkReceiverToTransactionQuery = `MATCH (u:User {id: $receiverId}), (t:Transaction {id: $id}) MERGE (t)-[:CREDIT]->(u)`;
const linkRelatedTransactionsQuery = `MATCH (t1:Transaction), (t2:Transaction) WHERE t1.id <> t2.id AND (t1.ip = t2.ip OR t1.deviceId = t2.deviceId) MERGE (t1)-[:RELATED_TO]->(t2) MERGE (t2)-[:RELATED_TO]->(t1)`;
const listAllTransactionsQuery = `MATCH (t:Transaction)
OPTIONAL MATCH (sender:User)-[sRel:DEBIT]->(t)
OPTIONAL MATCH (t)-[rRel:CREDIT]->(receiver:User)
RETURN DISTINCT t, sender, sRel, receiver, rRel`;

export async function createOrUpdateTransaction(driver, transactionData) {
  const session = driver.session();
  const { id, senderId, receiverId, amount, ip, deviceId } = transactionData;

  try {
    await session.run(createTransactionQuery, { id, amount, ip, deviceId });
    await session.run(linkSenderToTransactionQuery, { senderId, id });
    await session.run(linkReceiverToTransactionQuery, { receiverId, id });
    await session.run(linkRelatedTransactionsQuery);

    return { success: true, message: "Transaction created/linked" };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Error creating transaction",
    };
  } finally {
    await session.close();
  }
}

export async function updateTransactionAmount(driver, { id, amount }) {
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (t:Transaction {id: $id}) SET t.amount = $amount RETURN t`,
      { id, amount }
    );
    const updatedTransaction = result.records[0]?.get("t")?.properties || null;
    return { success: true, transaction: updatedTransaction };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Error updating transaction",
    };
  } finally {
    await session.close();
  }
}

export async function listAllTransactions(driver) {
  const session = driver.session();

  try {
    const result = await session.run(listAllTransactionsQuery);
    const transactions = result.records.map((record) => {
      const t = record.get("t").properties;
      const sender = record.get("sender")?.properties || null;
      const receiver = record.get("receiver")?.properties || null;
      return {
        transaction: t,
        sender,
        receiver,
      };
    });

    return { success: true, transactions };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Error listing transactions",
    };
  } finally {
    await session.close();
  }
}
