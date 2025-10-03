const transactionRelationshipQuery = `MATCH (t:Transaction {id: $id})-[r]-(n) RETURN t, r, n`;
const userRelationshipQuery = `MATCH (u:User {id: $id})-[r]-(n) RETURN u, r, n`;

export async function getUserRelationships(driver, userId) {
  const session = driver.session();

  try {
    const result = await session.run(userRelationshipQuery, { id: userId });
    const relationships = result.records.map((record) => ({
      source: record.get("u").properties,
      relationship: record.get("r").type,
      target: record.get("n").properties,
    }));

    return { success: true, relationships };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Error fetching user relationships",
    };
  } finally {
    await session.close();
  }
}

export async function getTransactionRelationships(driver, transactionId) {
  const session = driver.session();

  try {
    const result = await session.run(transactionRelationshipQuery, {
      id: transactionId,
    });
    const relationships = result.records.map((record) => ({
      source: record.get("t").properties,
      relationship: record.get("r").type,
      target: record.get("n").properties,
    }));

    return { success: true, relationships };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Error fetching transaction relationships",
    };
  } finally {
    await session.close();
  }
}
