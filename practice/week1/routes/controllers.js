const index = (req,res) =>{
    res.send('Hello skyler ');
};

const homepage = (req,res) =>{
    res.send('homepage ');
};

module.exports = {
    index,
    homepage
};