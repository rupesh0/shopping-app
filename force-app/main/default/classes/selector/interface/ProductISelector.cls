public interface ProductISelector {
    List<Product2> getAllAvailableProducts();
    List<Product2> selectByIds(List<Id> ids);
}
