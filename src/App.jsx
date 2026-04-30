/* eslint-disable function-paren-newline */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';
import { ProductList } from './components/ProductList/ProductList';

const products = productsFromServer.map(product => {
  const category =
    categoriesFromServer.find(cat => cat.id === product.categoryId) || null;
  const user =
    category !== null
      ? usersFromServer.find(u => u.id === category.ownerId) || null
      : null;

  return { ...product, category, user };
});

export const App = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);

  let visibleProducts = products;

  if (selectedUser) {
    visibleProducts = visibleProducts.filter(
      product => product?.user.id === selectedUser.id,
    );
  }

  if (searchFilter) {
    visibleProducts = visibleProducts.filter(product =>
      product.name.toLowerCase().includes(searchFilter.toLowerCase()),
    );
  }

  if (categoryFilter.length > 0) {
    visibleProducts = visibleProducts.filter(product =>
      categoryFilter.includes(product.category?.id),
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setSelectedUser(null)}
                className={selectedUser === null ? 'is-active' : ''}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  onClick={() => setSelectedUser(user)}
                  className={selectedUser?.id === user.id ? 'is-active' : ''}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={searchFilter}
                  onChange={e => setSearchFilter(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {searchFilter && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setSearchFilter('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setCategoryFilter([])}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  className={`button mr-2 my-1 ${categoryFilter.includes(category.id) ? 'is-info' : ''}`}
                  href="#/"
                  onClick={() =>
                    setCategoryFilter(
                      categoryFilter.includes(category.id)
                        ? categoryFilter.filter(id => id !== category.id)
                        : [...categoryFilter, category.id],
                    )
                  }
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => {
                  setCategoryFilter([]);
                  setSearchFilter('');
                  setSelectedUser(null);
                }}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        {visibleProducts.length > 0 ? (
          <ProductList products={visibleProducts} />
        ) : (
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>
        )}
      </div>
    </div>
  );
};
