//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma abicoder v2;

import '@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155BurnableUpgradeable.sol';
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract stockenCapital is  Initializable, ERC1155BurnableUpgradeable {

    uint public id = 1;
    string private _baseUri;
    string private _contractUri;

    struct Documento {
        uint creationDate;
        uint id;
        uint userID;
        bytes32 hashDocument;
    }
    struct TokenData{
        address owner;
        uint256 idUser;
        uint idCompany;
        uint amount;
        uint[] range;
        Category category;
        bytes info;
    }
    enum Category {
        PARTICIPACIONSOCIAL,JUNTA,NOTACONVERTIBLE
    }

    // save all NFT IPFS hashes
    mapping (uint => string) public ipfsHashes;
    mapping (uint => TokenData) public activos;
    //id-> bool ya esta minteado?
    mapping (uint => bool) public minted;
    mapping (uint=>Documento) public documentos;
    /// nftId --> los activos
    mapping (uint=>TokenData[]) public activosByUser;

    //EVENTS
    event newActivo( uint userId,bytes info,Category category, uint id);
    event burnNFT(address creator, uint id);
    event newDocumento(uint ownerId,uint idDocument,bytes32 hashDocument);
    event nftMinted(address userAddress,uint nftID,uint amount);


    //MODIFIERS
    modifier onlyOwner(){
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Only owner can access");
        _;
    }

    function initialize (string memory contractUri) public initializer()  {
  _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _baseUri = "ipfs://";
        __ERC1155Burnable_init();
        _contractUri = string(abi.encodePacked("ipfs://", contractUri));
    }


    function contractURI() public view returns (string memory) {
        return _contractUri;
    }


    function getActivo(uint256 tokenId) public view returns (TokenData memory){
        return activos[tokenId];
    }
    function getActivosByUser(uint256 _userId) public view returns (TokenData[] memory){
        return activosByUser[_userId];
    }
     function getDocumento(uint256 _documentoID) public view returns (Documento memory){
        return documentos[_documentoID];
    }
 
    

    
    /**
     * @dev user creates new NFTs
     */
    function createNewActivo(uint[] memory _range,uint _idUser, uint _idCompany,Category _category,bytes memory _info,uint _amount) public onlyOwner returns (uint){
        
        activos[id] = TokenData({
            owner: address(this),
            category:_category,
            idCompany:_idCompany,
            range:_range,
            info:_info,
            idUser:_idUser,
            amount:_amount
        });
        activosByUser[_idUser].push(activos[id]);
        emit newActivo(_idUser,_info,_category, id);
        id++;
        return(id-1);
    }
    function mintActivo(address _userAddress,uint _nftID) public onlyOwner() {
        require(!minted[_nftID],"Ya esta minteado");
        _mint(_userAddress, _nftID,activos[_nftID].amount,activos[_nftID].info);
        activos[_nftID].owner=_userAddress;
        emit nftMinted(_userAddress,_nftID,activos[_nftID].amount);
    }

        /**
     * @dev user creates new NFTs
     */
    function createNewDocumento(uint _userID, bytes32 _hashDocument,uint _idDocument) public onlyOwner returns (uint){
          documentos[_idDocument] = Documento({
            creationDate:block.timestamp,
            hashDocument:_hashDocument,
            id:_idDocument,
            userID:_userID
        });

        emit newDocumento(_userID,_idDocument,_hashDocument);
        return(_idDocument);
    }
    /**
     * @dev user burns his NFTs
     */
     /// Para que esto funcione hay que alterar burn en ERC1155BurnableUpgradeble (31) y permitir al owner
     /// para que no pueda trasnferirlo alterar ERC1155Upgradeable en (120)
         function burnIt(address _owner, uint tokenId) public onlyOwner{
        burn(_owner, tokenId, 10**18);

        emit burnNFT(_owner, tokenId);
    }


}