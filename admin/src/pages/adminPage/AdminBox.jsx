import Button from "../../base-components/Button";

function AdminBox() {
  return (
    <div className="intro-y sm:w-[30%] min-w-80 w-full">
      <div className="p-5 box flex flex-col gap-5">
        <div className="intro-y flex items-center gap-4">
          <div className="w-16 h-16 rounded-md overflow-hidden">
            <img
              className="w-full h-full object-cover"
              src={`https://www.shutterstock.com/image-photo/young-handsome-man-beard-wearing-600nw-1768126784.jpg`}
             
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-medium">houssemn dridi</h2>
          </div>
        </div>
        <div className="flex gap-5 w-full justify-center">
        <div>27154280</div>
        <p>ahmed@gmail.com</p>

        </div>
        <div className="flex items-center w-fit gap-5">
                  <div className="center__img w-8 h-8 rounded-md overflow-hidden">
                    <img
                      className="w-full h-full object-cover"
                      src="http://localhost:5000/uploads/center/center-1745860666118-925982914.png"
                    
                    />
                  </div>
                  <div className="center__info flex flex-1 flex-col justify-around">
                    <h2 className="text-xs">
                      works at{" "}
                      <a
                        to={`/centers/abc`}
                        className="text-blue-600 underline"
                      >
                        amilkar
                      </a>
                    </h2>
                    <p className="center__desc flex items-center gap-3">
                    
                    
                    </p>
                  </div>
        </div>
        <div className="flex justify-between">
        <Button
        variant="primary"
        className="w-24"
        >
        modifier
        </Button>
        <Button
        variant="danger"
        className="w-24"
        >
        activer
        </Button>

        </div>
      </div>
    </div>
  );
}

export default AdminBox;
