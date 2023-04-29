

class ApiFeatures {
    constructor (mongooseQuery,queryData){
        this.mongooseQuery = mongooseQuery;
        this.queryData = queryData
    }

    pagination (){
        let {page,size } = this.queryData
        if (!page || page<1) page=1
        if (!size || size<1 ) size=2
    
        const limit = parseInt(size)
        const skip = (parseInt(page) -1 ) * parseInt(size);
    
        this.mongooseQuery.limit(limit).skip(skip)
        return this
    }
    filter(){
  
       const excludequeryparams = ['page','size','sort','search','fields']
       const filterquery = {...this.queryData};
       for (const param of excludequeryparams) {
        delete filterquery[param]
       }
       const queryfilter =JSON.parse(JSON.stringify(filterquery).replace(/(lt|lte|gt|gte|in|nin|eq|neq)/g,(match) => `$${match}`))
  
   this.mongooseQuery.find(queryfilter);
   return this
    }


    sort(){
          if (this.queryData.sort) {
            
              this.mongooseQuery.sort(this.queryData.sort?.replace(','," "));
          }                                 
       return this

    }


    search(){
        if (this.queryData.search) {
            
            this.mongooseQuery.find({
           $or:[{name:{$regex:this.queryData.search,$options:'i'}}]
         })
        }
      return this
    }

    select(){
       this.mongooseQuery.select(this.queryData.fields?.replace(','," "));
       return this
    }
}

export default ApiFeatures