import express from "express";
import { connection } from "./database.js";
const app = express();
app.use(express.json());

//ADD PRODUCT
app.post("/products", async (req,res)=>{
    try {
        await connection.execute(
            "INSERT INTO products (id,name,price) VALUES (?,?,?)",
            [req.body.id, req.body.name, req.body.price]
        );
        res.send("Product berhasil ditambah");
    } catch (error) {
        res.status(404).send("Id tidak boleh sama");
    }
});

//get PRODUCT By Id
app.get("/products/:id", async(req,res)=>{
    try {
        const result= await connection.query("SELECT * from products WHERE id=?",[req.params.id]);
        if(result.length === 0) res.status(404).send("id tidak ditemukan!");
        res.json(result);
    } catch (error) {
    }
})

//GET ALL PRODUCTS
app.get("/products", async(req,res)=>{
    const result= await connection.query("SELECT * from products");
    res.json(result);
})

//UPDATE PRODUCT BY ID
app.put("/products/:id", async(req,res)=>{
    try {
        const r= await connection.execute(
             "UPDATE products SET name=?, price=? WHERE id=?",
             [req.body.name, req.body.price, req.params.id]
         );
         if(r.affectedRows === 0) return res.status(404).send("ID tdk ada");
         res.send("Product berhasil di update");
    } catch (error) {
        
    }
})

//DELETE PRODUCT BY ID
app.delete("/products/:id", async (req,res)=>{
    try {
        const result = await connection.execute("DELETE from products WHERE id=?",[req.params.id]);
        // result.affectedRows = untuk memastikan bahwa id yang ada dalam database seblm dihapus
        if(result.affectedRows === 0) return res.status(404).send("ID tidak ditemukan!");
        res.send("PRODUCT BERHASIL DIHAPUS");
    } catch (error) {
        res.status(500).send("Terjadi kesalahan pada server!");
    }
});

//penjelasan try catch
// menangani kesalahan (error handling)
//Tujuannya adalah untuk menjalankan kode dan "menangkap" kesalahan 
//yang mungkin terjadi selama eksekusi kode tersebut, agar aplikasi tidak crash atau berhenti bekerja.

            //========= CARA KERJA ==========
//Blok try: Tempat kita menuliskan kode yang mungkin bisa menimbulkan kesalahan. 
//Jika tidak ada kesalahan, kode dalam blok try akan dieksekusi sampai selesai.
// Blok catch: Tempat kita menuliskan kode untuk menangani kesalahan yang terjadi di dalam blok try.
// Jika ada kesalahan, eksekusi akan langsung lompat ke blok catch.

            // ======= KESIMPULAN ==========
// Menjalankan kode yang mungkin menyebabkan kesalahan tanpa menghentikan seluruh aplikasi.
// Menangani kesalahan dengan cara yang tepat dan memberikan pesan yang jelas kepada pengguna.
// Mencegah aplikasi dari berhenti secara tiba-tiba dan memberikan pengalaman yang lebih baik kepada pengguna.





//============ TANPA BASIS DATA ========

// let datas =[];

// app.get("/coba",(req,res)=>{
//     res.send("hello");
// })

// app.post("/addData",(req,res)=>{
//     datas.push(req.body);
//     res.send("data berhasil ditambah");
// })
// app.get("/getData",(req,res)=>{
//     res.send(datas);
// })
// //update by index
// app.put("/updateData/:index",(req,res)=>{
//     const dataIndex = datas.findIndex((data,i)=>i==req.params.index)
//     if(dataIndex === -1){
//         res.send("data tidak ditemukan");
//     }
//     datas[dataIndex]=req.body;
//     console.log(datas[dataIndex]);
//     res.send("data berhasil diubah");
// })
// //update by id
// app.put("/updateById/:id",(req,res)=>{
//     const dataId = datas.findIndex((data)=>data.id==req.params.id);
//     if(dataId ===-1){
//         res.status(404).send("data tidak ditemukan")
//     }
//     datas[dataId]={...datas[dataId], ...req.body}
//     res.send("data diupdate");
// })

// //delete
// app.delete("/deleteData/:index",(req,res)=>{
//     const dataIndex = datas.findIndex((data,i)=>i == req.params.index)
//     if(dataIndex === -1){
//         res.send("data tidak ditemukan");
//     }
//     datas.splice(dataIndex,1);
//     res.send("data berhasil dihapus")
// })

// //deleteById
// app.delete("/deleteById/:id",(req,res)=>{
//     const dataIndex = datas.findIndex((data)=>data.id == req.params.id)
//     if(dataIndex === -1){
//         res.send("data tidak ditemukan");
//     }
//     datas.splice(dataIndex,1);
//     res.send("data berhasil dihapus")
// })

//untuk negejakanin servernya
app.listen(3000,()=>console.log("server jalan"));