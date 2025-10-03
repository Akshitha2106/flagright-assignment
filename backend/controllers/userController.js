const createUserQuery = `MERGE (u:User {id: $id}) SET u.name = $name, u.email = $email, u.phone = $phone, u.address = $address, u.payment_methods = $payment_methods`;
const createUserSharedAttributeLinksQuery = `MATCH (u1:User), (u2:User) WHERE u1.id <> u2.id AND (u1.email = u2.email OR u1.phone = u2.phone OR u1.address = u2.address OR u1.payment_methods = u2.payment_methods) MERGE (u1)-[:SHARED_ATTRIBUTE]->(u2) MERGE (u2)-[:SHARED_ATTRIBUTE]->(u1)`;
const listAllUsersQuery = `MATCH (u:User) RETURN u`;

export async function createOrUpdateUser(driver, userData) {
  const session = driver.session();
  const { id, name, email, phone, address, payment_methods } = userData;

  try {
    const result = await session.run(createUserQuery, {
      id,
      name,
      email,
      phone,
      address,
      payment_methods,
    });

    await session.run(createUserSharedAttributeLinksQuery);

    return { success: true, message: "User created/updated", result };
  } catch (err) {
    return { success: false, error: err.message || "Error creating user" };
  } finally {
    await session.close();
  }
}

export async function listAllUsers(driver) {
  const session = driver.session();

  try {
    const result = await session.run(listAllUsersQuery);
    const users = result.records.map((record) => record.get("u").properties);
    return { success: true, users };
  } catch (err) {
    return { success: false, error: err.message || "Error listing users" };
  } finally {
    await session.close();
  }
}
