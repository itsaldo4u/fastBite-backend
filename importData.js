import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ---------------------------------------------------------------------------------
// ⚠️ HAPI I PARË: ZËVENDËSO KËTË ME KONEKSION STRING-un TUAJ
const mongoURI =
  "mongodb+srv://aldomecani20_db_user:GKSv1lFHUa4ZMY5g@cluster0.rzyinjv.mongodb.net/fastbite";
// ---------------------------------------------------------------------------------

// Llogarit rrugët e dosjeve (e nevojshme për modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importo Të Gjitha Modelet
// Sigurohu që path-i të jetë i saktë, p.sh., './models/User.js'
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import Offer from "./models/Offer.js";
import Reward from "./models/Reward.js";

// 4. Lexo të dhënat nga skedari JSON (Ndrysho rrugën nëse ke vend tjetër!)
// Këtu supozojmë se të dhënat i ke tek ./data/db.json
const dataPath = path.join(__dirname, "data", "db.json");
let data;
try {
  const rawData = fs.readFileSync(dataPath, "utf-8");
  data = JSON.parse(rawData);
} catch (err) {
  console.error(
    `❌ Gabim: Nuk u gjet ose nuk u lexua skedari i të dhënave në: ${dataPath}`
  );
  console.error("Kontrollo rrugën ose emrin e skedarit tuaj JSON.");
  process.exit(1);
}

const importData = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("✅ Lidhja me MongoDB u realizua!");

    // ---- FSHIRJA E TË DHËNAVE TË VJETRA (Thelbësore) ----
    console.log("🗑️ Po fshihen të gjitha të dhënat ekzistuese...");
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    await Offer.deleteMany();
    await Reward.deleteMany();
    console.log("Të dhënat e vjetra u fshinë.");

    // ---- IMPORTIMI I TË DHËNAVE NGA JSON ----
    console.log("🚀 Po fillon importi i të dhënave të reja...");

    // Përdoruesit
    await User.insertMany(data.users);
    console.log(`👤 U importuan ${data.users.length} përdorues.`);

    // Produktet
    await Product.insertMany(data.products);
    console.log(`🍔 U importuan ${data.products.length} produkte.`);

    // Porositë
    await Order.insertMany(data.orders);
    console.log(`📦 U importuan ${data.orders.length} porosi.`);

    // Ofertat
    await Offer.insertMany(data.offers);
    console.log(`⭐ U importuan ${data.offers.length} oferta.`);

    // Rewards
    await Reward.insertMany(data.rewards);
    console.log(`🎁 U importuan ${data.rewards.length} rewards.`);

    console.log("\n🎉 Importi i të dhënave përfundoi me sukses!");
  } catch (err) {
    console.error("\n❌ Gabim gjatë procesit të importimit:");
    console.error(err.message);
    console.error(
      "\nKontrollo: 1) Connection String, 2) Strukturën e Modeleve (Schemas)."
    );
  } finally {
    mongoose.connection.close();
    console.log("\nLidhja me DB u mbyll.");
    process.exit();
  }
};

importData();
